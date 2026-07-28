"use server"

import { revalidatePath } from "next/cache"
import { requireRole } from "@/lib/session"
import { prisma } from "@/server/db"
import type { AdminOverview, ApiResponse } from "@/types"

export async function getAdminOverviewAction(): Promise<
  ApiResponse<AdminOverview>
> {
  try {
    await requireRole(["ADMIN"])
  } catch {
    return { success: false, error: "Forbidden" }
  }

  try {
    const [
      totalUsers,
      totalTipsters,
      totalPredictions,
      pendingWithdrawals,
      pendingVerifications,
      openReports,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.tipster.count(),
      prisma.prediction.count(),
      prisma.withdrawal.count({ where: { status: "PENDING" } }),
      prisma.verificationRequest.count({ where: { status: "PENDING" } }),
      prisma.report.count({ where: { status: "PENDING" } }),
    ])

    const revenue = await prisma.payment.aggregate({
      where: { status: "COMPLETED" },
      _sum: { amount: true },
    })

    return {
      success: true,
      data: {
        totalUsers,
        totalTipsters,
        totalPredictions,
        totalRevenue: Number(revenue._sum.amount ?? 0),
        pendingWithdrawals,
        pendingVerifications,
        openReports,
      },
    }
  } catch (error) {
    console.error("[getAdminOverviewAction]", error)
    return { success: false, error: "Failed to load admin overview" }
  }
}

export async function banUserAction(
  userId: string,
  banned: boolean
): Promise<ApiResponse> {
  try {
    await requireRole(["ADMIN"])
    await prisma.user.update({
      where: { id: userId },
      data: { banned },
    })
    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("[banUserAction]", error)
    return { success: false, error: "Action failed" }
  }
}

export async function approveWithdrawalAction(
  withdrawalId: string
): Promise<ApiResponse> {
  try {
    await requireRole(["ADMIN"])
    const updated = await prisma.withdrawal.updateMany({
      where: { id: withdrawalId, status: "PENDING" },
      data: { status: "APPROVED", processedAt: new Date() },
    })
    if (!updated.count) {
      return { success: false, error: "Withdrawal not found or already processed" }
    }
    revalidatePath("/admin/withdrawals")
    return { success: true }
  } catch (error) {
    console.error("[approveWithdrawalAction]", error)
    return { success: false, error: "Failed to approve withdrawal" }
  }
}

export async function approveVerificationAction(
  requestId: string
): Promise<ApiResponse> {
  try {
    await requireRole(["ADMIN"])
    const request = await prisma.verificationRequest.update({
      where: { id: requestId },
      data: { status: "APPROVED", reviewedAt: new Date() },
    })

    await prisma.tipster.updateMany({
      where: { userId: request.userId },
      data: { isVerified: true },
    })

    revalidatePath("/admin/verifications")
    return { success: true }
  } catch (error) {
    console.error("[approveVerificationAction]", error)
    return { success: false, error: "Failed to approve verification" }
  }
}

export async function resolveReportAction(
  reportId: string,
  status: "RESOLVED" | "DISMISSED"
): Promise<ApiResponse> {
  try {
    await requireRole(["ADMIN"])
    await prisma.report.update({
      where: { id: reportId },
      data: { status },
    })
    revalidatePath("/admin/reports")
    return { success: true }
  } catch (error) {
    console.error("[resolveReportAction]", error)
    return { success: false, error: "Failed to update report" }
  }
}

export async function updatePlatformSettingsAction(
  settings: Record<string, string | number | boolean>
): Promise<ApiResponse> {
  try {
    await requireRole(["ADMIN"])
    // Persist allowlisted keys only
    const allowed = ["commission_rate", "min_withdrawal", "maintenance_mode"] as const
    for (const key of allowed) {
      if (settings[key] === undefined) continue
      await prisma.platformSetting.upsert({
        where: { key },
        create: { key, value: settings[key] as never },
        update: { value: settings[key] as never },
      })
    }
    revalidatePath("/admin/settings")
    return { success: true, message: "Settings saved" }
  } catch (error) {
    console.error("[updatePlatformSettingsAction]", error)
    return { success: false, error: "Forbidden or save failed" }
  }
}
